# [EtherOJ](//oj.akioi.icu)
<img alt="GitHub" src="https://img.shields.io/github/license/EtherOJ/EtherOJ">
<img alt="Website" src="https://img.shields.io/website?up_message=online&url=https%3A%2F%2Foj.akioi.icu">

[EtherOJ](//oj.akioi.icu) is a open source and free OnlineJudge, entirely based on GitHub.

## Purpose of this project

This project aims to give a way to let community publish judgable *live* problems on GitHub.

More and more OnlineJudges are disappearing in recent years. As these OJs died, their problems would disappear too. This project can also be an archive for these problems.

## Features

- **Open Source:** The entire project is open source  and free for everyone.
- **Live forever:** The judger, problemset, judge result, users, submissions... everything is stored and based on GitHub, whose stability and data security is trusted by 40 million GitHub users.
- **Freedom:** Problem description and testcases are open without restriction.
- **Distributed:** There's no "official" centralized problem repository. You can easily create, share and judge your own problem by simply creating your problem repository. 

## Project Structure

The entire project is hosted on our [EtherOJ Organization](//github.com/EtherOJ) page.

- **EtherOJ/EtherOJ:** Frontend of EtherOJ
- **[EtherOJ/EtherJudger](//github.com/EtherOJ/EtherJudger):** GitHub Actions as a problem judger.
- **[EtherOJ/problems](//github.com/EtherOJ/EtherJudger):** Problem repository example.
- **EtherOJ/submissions:** EtherOJ submissions storage.

## Contribute

Contributions are highly welcomed as we still have a lot to do, please join us to make this project better!

If you have any problems using EtherOJ or want to contribute code to this project, don't hesitate to file an issue or open a Pull Request. 

And, don't forget to leave a Star if you like this project!

## Run your EtherOJ frontend

```bash
# clone this repository
$ git clone https://github.com/EtherOJ/EtherOJ

# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start
```
