{ pkgs ? import <nixpkgs> {}
, webRoot ? "/app"
, nginxFallbackPort ? "8010"
, githubCommit ? "unknown"
, buildUrl ? "unknown"
, dockerTag ? "latest"
}:

let

  yarn2nixSrc = pkgs.fetchFromGitHub {
    owner = "moretea";
    repo = "yarn2nix";
    rev = "107c6118b49fa5aad2f6a7ece0621ff379534547";
    sha256 = "08p23x8j4q9v1qlcr642h9484f6x9r1f13r10i21k2vv149clrs8";
  };

  yarn2nixRepo = pkgs.callPackage yarn2nixSrc { };

in

rec {

  webContent = yarn2nixRepo.mkYarnPackage {
    src = ./.;
    postInstall = ''
      yarn build
      rm -rf $out
      mkdir -p $out/${webRoot}
      cp -r build/. $out/${webRoot}
    '';
  };

  versionJson = pkgs.writeTextFile rec {
    name = "version.json";
    text = builtins.toJSON {
      version = webContent.package.version;
      source = "https://github.com/mozilla-releng/shipit-v2";
      commit = githubCommit;
      build = buildUrl;
    };
    destination = "${webRoot}/${name}";
  };

  docker =
    let
      nginxConfTemplate = pkgs.writeText "nginx.conf.template" ''
        user app app;
        daemon off;
        error_log /dev/stdout debug;
        pid /dev/null;
        events {}
        http {
          include ${pkgs.nginx}/conf/mime.types;
          access_log /dev/stdout;
          server {
            listen @PORT@;
            index index.html;
            root ${webRoot};

            # Dockerflow endpoints
            rewrite ^/__version__$ /version.json;
            location /__heartbeat__ {
              return 200 OK;
            }
            location /__lbheartbeat__ {
              return 200 OK;
            }
            # Dockerflow endpoints end

            # Route all URL via index.html
            location / {
              try_files $uri /index.html =404;
            }

          }
        }
      '';

      # Dockerflow passes the desired port as PORT environment variable
      nginxStartScript = pkgs.writeScript "startnginx" ''
        #!/bin/sh
        if [ -z $PORT ]; then PORT=${nginxFallbackPort}; fi
        sed -e s/@PORT@/$PORT/g ${nginxConfTemplate} > /etc/nginx.conf
        exec nginx -c /etc/nginx.conf
      '';

      dockerContents = [ pkgs.busybox pkgs.nginx webContent ];

    in pkgs.dockerTools.buildImage {
      name = "ship-it-ui";
      contents = if githubCommit != "unknown" then dockerContents ++ [ versionJson ] else dockerContents;
      fromImage = null;
      tag = dockerTag;
      runAsRoot = ''
        #!${pkgs.stdenv.shell}
        ${pkgs.dockerTools.shadowSetup}
        groupadd --gid 10001 app
        useradd --home-dir ${webRoot} --uid 10001 --gid app app
      '';
      config =
        { Env = [
            "PATH=/bin"
            "LANG=en_US.UTF-8"
          ];
          Cmd = [ nginxStartScript ];
          WorkingDir = "/";
        };
    };
}
