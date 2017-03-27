#!/bin/sh
ansible-playbook deploy-app.yml -i production -u root "$@"
