#!/bin/bash

MAJOR_VERSION="3"
MINOR_VERSION="0"
VERSION="$MAJOR_VERSION.$MINOR_VERSION"
BRANCH=""

TAG_FLAG=false
PUSH_FLAG=false

while getopts ":tpb:" opt; do
  case ${opt} in
    t)
      TAG_FLAG=true
      ;;
    p)
      PUSH_FLAG=true
      ;;
    b)
      BRANCH="$OPTARG"
      ;;
    \?)
      echo "Invalid option: -$OPTARG" >&2
      echo "Usage: $0 [-t] [-p] [-b branch]"
      exit 1
      ;;
  esac
done


docker build -t canvas_management:$VERSION .


if [ "$TAG_FLAG" = true ]; then
  echo "Tagging images..."
  
  if [ -n "$BRANCH" ]; then
    # Branch-specific tags
    echo "alexmickelson/canvas_management:$VERSION-$BRANCH"
    echo "alexmickelson/canvas_management:$MAJOR_VERSION-$BRANCH"
    echo "alexmickelson/canvas_management:latest-$BRANCH"
    
    docker image tag canvas_management:"$VERSION" alexmickelson/canvas_management:"$VERSION-$BRANCH"
    docker image tag canvas_management:"$VERSION" alexmickelson/canvas_management:"$MAJOR_VERSION-$BRANCH"
    docker image tag canvas_management:"$VERSION" alexmickelson/canvas_management:latest-$BRANCH
    
    # Only create non-branch tags if branch is "main"
    if [ "$BRANCH" = "main" ]; then
      echo "alexmickelson/canvas_management:$VERSION"
      echo "alexmickelson/canvas_management:$MAJOR_VERSION"
      echo "alexmickelson/canvas_management:latest"
      
      docker image tag canvas_management:"$VERSION" alexmickelson/canvas_management:"$VERSION"
      docker image tag canvas_management:"$VERSION" alexmickelson/canvas_management:"$MAJOR_VERSION"
      docker image tag canvas_management:"$VERSION" alexmickelson/canvas_management:latest
    fi
  else
    # No branch specified - create standard tags (for local development)
    echo "alexmickelson/canvas_management:$VERSION"
    echo "alexmickelson/canvas_management:$MAJOR_VERSION"
    echo "alexmickelson/canvas_management:latest"
    
    docker image tag canvas_management:"$VERSION" alexmickelson/canvas_management:"$VERSION"
    docker image tag canvas_management:"$VERSION" alexmickelson/canvas_management:"$MAJOR_VERSION"
    docker image tag canvas_management:"$VERSION" alexmickelson/canvas_management:latest
  fi
fi

if [ "$PUSH_FLAG" = true ]; then
  echo "Pushing images..."
  
  if [ -n "$BRANCH" ]; then
    # Push branch-specific tags
    echo "alexmickelson/canvas_management:$VERSION-$BRANCH"
    echo "alexmickelson/canvas_management:$MAJOR_VERSION-$BRANCH"
    echo "alexmickelson/canvas_management:latest-$BRANCH"
    
    docker push alexmickelson/canvas_management:"$VERSION-$BRANCH"
    docker push alexmickelson/canvas_management:"$MAJOR_VERSION-$BRANCH"
    docker push alexmickelson/canvas_management:latest-$BRANCH
    
    # Only push non-branch tags if branch is "main"
    if [ "$BRANCH" = "main" ]; then
      echo "alexmickelson/canvas_management:$VERSION"
      echo "alexmickelson/canvas_management:$MAJOR_VERSION"
      echo "alexmickelson/canvas_management:latest"
      
      docker push alexmickelson/canvas_management:"$VERSION"
      docker push alexmickelson/canvas_management:"$MAJOR_VERSION"
      docker push alexmickelson/canvas_management:latest
    fi
  else
    # No branch specified - push standard tags (for local development)
    echo "alexmickelson/canvas_management:$VERSION"
    echo "alexmickelson/canvas_management:$MAJOR_VERSION"
    echo "alexmickelson/canvas_management:latest"
    
    docker push alexmickelson/canvas_management:"$VERSION"
    docker push alexmickelson/canvas_management:"$MAJOR_VERSION"
    docker push alexmickelson/canvas_management:latest
  fi
fi

if [ "$TAG_FLAG" = false ] && [ "$PUSH_FLAG" = false ]; then
  echo ""
  echo "Build complete."
  echo "To tag, run with -t flag."
  echo "To push, run with -p flag."
  echo "To build for a specific branch, use -b branch_name flag."
  echo "Or manually run:"
  echo ""
  if [ -n "$BRANCH" ]; then
    echo "# Branch-specific tags:"
    echo "docker image tag canvas_management:$VERSION alexmickelson/canvas_management:$VERSION-$BRANCH"
    echo "docker image tag canvas_management:$VERSION alexmickelson/canvas_management:$MAJOR_VERSION-$BRANCH"
    echo "docker image tag canvas_management:$VERSION alexmickelson/canvas_management:latest-$BRANCH"
    echo "docker push alexmickelson/canvas_management:$VERSION-$BRANCH"
    echo "docker push alexmickelson/canvas_management:$MAJOR_VERSION-$BRANCH"
    echo "docker push alexmickelson/canvas_management:latest-$BRANCH"
    if [ "$BRANCH" = "main" ]; then
      echo ""
      echo "# Main branch also gets standard tags:"
      echo "docker image tag canvas_management:$VERSION alexmickelson/canvas_management:$VERSION"
      echo "docker image tag canvas_management:$VERSION alexmickelson/canvas_management:$MAJOR_VERSION"
      echo "docker image tag canvas_management:$VERSION alexmickelson/canvas_management:latest"
      echo "docker push alexmickelson/canvas_management:$VERSION"
      echo "docker push alexmickelson/canvas_management:$MAJOR_VERSION"
      echo "docker push alexmickelson/canvas_management:latest"
    fi
  else
    echo "docker image tag canvas_management:$VERSION alexmickelson/canvas_management:$VERSION"
    echo "docker image tag canvas_management:$VERSION alexmickelson/canvas_management:$MAJOR_VERSION"
    echo "docker image tag canvas_management:$VERSION alexmickelson/canvas_management:latest"
    echo "docker push alexmickelson/canvas_management:$VERSION"
    echo "docker push alexmickelson/canvas_management:$MAJOR_VERSION"
    echo "docker push alexmickelson/canvas_management:latest"
  fi
fi
