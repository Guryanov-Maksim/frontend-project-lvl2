### Hexlet tests and linter status:
[![Actions Status](https://github.com/Guryanov-Maksim/frontend-project-lvl2/workflows/hexlet-check/badge.svg)](https://github.com/Guryanov-Maksim/frontend-project-lvl2/actions)
[![tests](https://github.com/Guryanov-Maksim/frontend-project-lvl2/actions/workflows/tests.yml/badge.svg)](https://github.com/Guryanov-Maksim/frontend-project-lvl2/actions/workflows/tests.yml)
[![Maintainability](https://api.codeclimate.com/v1/badges/31abb43bfd7a3e7213f8/maintainability)](https://codeclimate.com/github/Guryanov-Maksim/frontend-project-lvl2/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/31abb43bfd7a3e7213f8/test_coverage)](https://codeclimate.com/github/Guryanov-Maksim/frontend-project-lvl2/test_coverage)

# gendiff

This library let you compare two configuration files and get the difference between them in different formats. 

The following file types are supported:
- json
- yml

## Installation
        git clone https://github.com/Guryanov-Maksim/frontend-project-lvl2.git gendiff
        cd gendiff
        make install

## Run tests
        make test

## Creating executable files

If you want to use the lib as a cli script you will need to run `npm link` command in the root directory of the library after installation (see [npm link](https://docs.npmjs.com/cli/v7/commands/npm-link)). After that you will be able to use the lib in the command line as shown below:
        
        gendiff [options] pathToFile1 pathToFile2

## Use

The asciicasts listed below show the use of the library as a cli script

A comparison of two plain json
[![asciicast](https://asciinema.org/a/Iz7EiM7Zu3bglIxvEM3XLWW11.svg)](https://asciinema.org/a/Iz7EiM7Zu3bglIxvEM3XLWW11)

A comparison of two plain yml
[![asciicast](https://asciinema.org/a/6YdPa8tN1XaakBIJtvWPv8fow.svg)](https://asciinema.org/a/6YdPa8tN1XaakBIJtvWPv8fow)

A comparison of two embedded json
[![asciicast](https://asciinema.org/a/1XTX2u8RwqvhpumH3hUhqlJbN.svg)](https://asciinema.org/a/1XTX2u8RwqvhpumH3hUhqlJbN)

gendiff output in plain format
[![asciicast](https://asciinema.org/a/yh4u4ITmmzuduaigmauLXkx3o.svg)](https://asciinema.org/a/yh4u4ITmmzuduaigmauLXkx3o)

gendiff output in json format 
[![asciicast](https://asciinema.org/a/wgvR4ZLy12LmLxrFB1Iocuw54.svg)](https://asciinema.org/a/wgvR4ZLy12LmLxrFB1Iocuw54)