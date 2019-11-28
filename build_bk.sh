#!/bin/bash

if [[ $TRAVIS_BRANCH == 'development' ]]
then
  ng build --configuration=development
fi

if [[ $TRAVIS_BRANCH == 'qa' ]]
then
  ng build --configuration=qa
fi

if [[ $TRAVIS_BRANCH == 'uat' ]]
then
  ng build --configuration=uat
fi

if [[ $TRAVIS_BRANCH == 'prod' ]]
then
  ng build --prod
fi

if [[ $TRAVIS_BRANCH == 'master' ]]
then
  ng build --prod
fi