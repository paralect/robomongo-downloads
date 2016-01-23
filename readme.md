## Robomongo downloads

This is git repo of the application used to upload/download robomongo distributives

## Manual release upload

That might be needed sometimes:

```
curl -i -X POST \
    -F "image=@/path/to/robomongo/distributive" \
    "http://download.robomongo.org/upload?os={osx|windows|linux}&version={ex.: 0.9.0-RC}1&token={AUTH_TOKEN}"
```
