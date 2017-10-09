# Development Readme

## Install locally
Clone and install locally:
```shell
git clone https://github.com/Trioxis/react-cafe-cms.git
cd react-cafe-cms
yarn install
```

## Local development
```shell
yarn link
yarn dev
```
This will rebuild the module every time a change is made. Within another project, you can use the following command to use your local development version in that project

```shell
yarn link @trioxis/react-cafe-cms
```

## Run tests
Run [Jest](https://facebook.github.io/jest/) tests in watch mode.
```shell
# Use '--' if you're using yarn before v1.0
yarn test --watch
```
