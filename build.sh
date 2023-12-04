#!/bin/bash


VERSION="1.0"

dotnet publish Management.Web/ \
    --os linux \
    --arch x64 \
    /t:PublishContainer \
    -c Release \
    -p ContainerImageTags="\"$VERSION;latest\"" \
    -p ContainerRepository="canvas_management"

docker image tag canvas_management:$VERSION alexmickelson/canvas_management:$VERSION