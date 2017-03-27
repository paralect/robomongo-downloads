#!/bin/sh
ansible-playbook playbook-all.yml -i production -u root "$@"
