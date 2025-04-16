#!/bin/bash

MAJOR_VERSION="2"
MINOR_VERSION="7"
VERSION="$MAJOR_VERSION.$MINOR_VERSION"

TAG_FLAG=false
PUSH_FLAG=false

while getopts ":tp" opt; do
  case ${opt} in
    t)
      TAG_FLAG=true
      ;;
    p)
      PUSH_FLAG=true
      ;;
    \?)
      echo "Invalid option: -$OPTARG" >&2
      echo "Usage: $0 [-t] [-p]"
      exit 1
      ;;
  esac
done


docker build -t canvas_management:$VERSION .


if [ "$TAG_FLAG" = true ]; then
  echo "Tagging images..."
  echo "alexmickelson/canvas_management:$VERSION"
  echo "alexmickelson/canvas_management:$MAJOR_VERSION"
  echo "alexmickelson/canvas_management:latest"

  docker image tag canvas_management:"$VERSION" alexmickelson/canvas_management:"$VERSION"
  docker image tag canvas_management:"$VERSION" alexmickelson/canvas_management:"$MAJOR_VERSION"
  docker image tag canvas_management:latest alexmickelson/canvas_management:latest
fi

if [ "$PUSH_FLAG" = true ]; then
  echo "Pushing images..."
  echo "alexmickelson/canvas_management:$VERSION"
  echo "alexmickelson/canvas_management:$MAJOR_VERSION"
  echo "alexmickelson/canvas_management:latest"

  docker push alexmickelson/canvas_management:"$VERSION"
  docker push alexmickelson/canvas_management:"$MAJOR_VERSION"
  docker push alexmickelson/canvas_management:latest
fi

if [ "$TAG_FLAG" = false ] && [ "$PUSH_FLAG" = false ]; then
  echo ""
  echo "Build complete."
  echo "To tag, run with -t flag."
  echo "To push, run with -p flag."
  echo "Or manually run:"
  echo ""
  echo "docker image tag canvas_management:$VERSION alexmickelson/canvas_management:$VERSION"
  echo "docker image tag canvas_management:$VERSION alexmickelson/canvas_management:$MAJOR_VERSION"
  echo "docker image tag canvas_management:latest alexmickelson/canvas_management:latest"
  echo "docker push alexmickelson/canvas_management:$VERSION"
  echo "docker push alexmickelson/canvas_management:$MAJOR_VERSION"
  echo "docker push alexmickelson/canvas_management:latest"
fi
