#!/bin/sh
ansible-playbook setup-server.yml -i production -u root "$@"
