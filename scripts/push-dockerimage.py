#! /usr/bin/env nix-shell
#! nix-shell -i python -p python pythonPackages.requests "(callPackage ./push.nix {}).packages.push"

import os
import sys
import requests
import push.image
import push.registry


tags = sys.argv[1:]

password_url = "http://taskcluster/secrets/v1/secret/repo:github.com/mozilla-releng/shipit-v2:dockerhub"

# XXX: killme
if True:
    password_url += "-testing"

req = requests.get(password_url)
req.raise_for_status()
secrets = req.json()["secret"]["dockerhub"]

image_name = "{}/ship-it-ui".format(secrets["repo"])

for tag in tags:
    push.registry.push(
        push.image.spec(os.path.realpath("result")),
        "https://index.docker.io",
        secrets["username"],
        secrets["password"],
        image_name,
        tag,
    )
