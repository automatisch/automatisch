# Installation

<!-- TODO: Add instructions to install PostgreSQL and specify supported node versions -->

Automatisch supports both npm and docker installation.

### npm

You can try Automatisch without installing by using [npx](https://docs.npmjs.com/cli/v8/commands/npx).

```bash
npx automatisch
```

Or you can install Automatisch globally via [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).

```bash
npm install automatisch -g
```

You need to run the start command after the installation.

```bash
automatisch start
```

### docker

You can also use [docker](https://docs.docker.com/get-docker/) to install Automatisch.

```bash
docker run -it \
	--name automatisch \
	-p 3000:3000 \
	automatisch start
```

<!-- TODO: Check requirements of https usage and revise the document accordingly -->

## Let's discover!

✌️ That's it; you have Automatisch running. Let's check it out by browsing [http://localhost:3000](http://localhost:3000)

If you see any problem while installing Automatisch, let us know via [github issues](https://github.com/automatisch/automatisch/issues) or our [discord server](https://discord.gg/dJSah9CVrC).
