#!/bin/bash

if [[ $TRAVIS_BRANCH == 'development' ]]
  ng build --configuration=development
fi

if [[ $TRAVIS_BRANCH == 'qa' ]]
  ng build --configuration=qa
fi

if [[ $TRAVIS_BRANCH == 'uat' ]]
  ng build --configuration=uat
fi

if [[ $TRAVIS_BRANCH == 'prod' ]]
  ng build --prod
fi

if [[ $TRAVIS_BRANCH == 'master' ]]
  ng build --prod
fi