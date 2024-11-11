#!/bin/bash

MAJOR_VERSION="2"
MINOR_VERSION="2"
VERSION="$MAJOR_VERSION.$MINOR_VERSION"

docker build -t canvas_management:$VERSION .



echo "to push run: "
echo ""
echo "docker image tag canvas_management:$VERSION alexmickelson/canvas_management:$VERSION"
echo "docker image tag canvas_management:$VERSION alexmickelson/canvas_management:$MAJOR_VERSION"
echo "docker image tag canvas_management:latest alexmickelson/canvas_management:latest"
echo "docker push alexmickelson/canvas_management:$VERSION"
echo "docker push alexmickelson/canvas_management:$MAJOR_VERSION"
echo "docker push alexmickelson/canvas_management:latest"

