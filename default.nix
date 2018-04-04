{ pkgs ? import <nixpkgs> {} }:
let
  yarn2nixSrc = pkgs.fetchFromGitHub {
    owner = "moretea";
    repo = "yarn2nix";
    rev = "0472167f2fa329ee4673cedec79a659d23b02e06";
    sha256 = "10gmyrz07y4baq1a1rkip6h2k4fy9is6sjv487fndbc931lwmdaf";
  };
  yarn2nixRepo = pkgs.callPackage yarn2nixSrc { };
  inherit (yarn2nixRepo) mkYarnPackage;
in
  mkYarnPackage {
    src = ./.;
  }
