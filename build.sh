#!/bin/bash


MAJOR_VERSION="1"
MINOR_VERSION="4"
VERSION="$MAJOR_VERSION.$MINOR_VERSION"

dotnet publish Management.Web/ \
    --os linux \
    --arch x64 \
    /t:PublishContainer \
    -c Release \
    -p ContainerImageTags="\"$MAJOR_VERSION;$VERSION;latest\"" \
    -p ContainerRepository="canvas_management"



echo "to push run: "
echo ""
echo "docker image tag canvas_management:$VERSION alexmickelson/canvas_management:$VERSION"
echo "docker image tag canvas_management:$MAJOR_VERSION alexmickelson/canvas_management:$MAJOR_VERSION"
echo "docker image tag canvas_management:latest alexmickelson/canvas_management:latest"
echo "docker push alexmickelson/canvas_management:$VERSION"
echo "docker push alexmickelson/canvas_management:$MAJOR_VERSION"
echo "docker push alexmickelson/canvas_management:latest"