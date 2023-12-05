#!/bin/bash


VERSION="1.1"

dotnet publish Management.Web/ \
    --os linux \
    --arch x64 \
    /t:PublishContainer \
    -c Release \
    -p ContainerImageTags="\"$VERSION;latest\"" \
    -p ContainerRepository="canvas_management"



echo "to push run: "
echo "docker image tag canvas_management:$VERSION alexmickelson/canvas_management:$VERSION"
echo "docker image tag canvas_management:latest alexmickelson/canvas_management:latest"
echo "docker push alexmickelson/canvas_management:$VERSION"
echo "docker push alexmickelson/canvas_management:latest"