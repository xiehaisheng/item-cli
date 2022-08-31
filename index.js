#!/usr/bin/env node
import { Command } from "commander";
import download from "download-git-repo";
import inquirer from "inquirer";
import handlebars, { template } from "handlebars";
import fs from "fs";
import ora from "ora";
import chalk from "chalk";
import logSymbols from "log-symbols";
const program = new Command();

const templates = {
  react: {
    downloadUrl: "xiehaisheng/webpack5_react",
    dec: `react ${chalk.green('webpack5 + react CLI')}`,
  },
  vue: {
    downloadUrl: "xiehaisheng/webpack5_vue",
    dec: `vue ${chalk.green('webpack5 + vue CLI')}`,
  },
  utilsTemplate: {
    downloadUrl: "xiehaisheng/js-utils",
    dec: `utils ${chalk.green('编写一个自己js函数库 函数库模版')}`,
  },
};

program.version("0.0.1");
program
  .command("init <projectName> <tempName>")
  .description("项目初始化")
  .action((projectName, tempName) => {
    // 添加下载中样式
    const spinner = ora(
      `项目名称为：${projectName}, 使用模板为：${tempName} 下载中...`
    );
    spinner.start();
    const { downloadUrl } = templates[tempName];
    download(
      // 下载目标，格式为：用户名/仓库名字#分支
      downloadUrl,
      // 下载完成后的项目名称，也就是文件夹名
      projectName,
      // 下载结束后的回调
      (err) => {
        // 如果错误回调不存在，就表示下载成功了
        if (err) {
          spinner.fail(chalk.red("下载失败："));
          console.log(err);
          return;
        }
        spinner.succeed("下载成功！");
        inquirer
          .prompt([
            {
              type: "input",
              name: "name",
              message: "请输入项目名称",
            },
            {
              type: "input",
              name: "description",
              message: "请输入项目简介",
            },
            {
              type: "input",
              name: "author",
              message: "请输入作者名称",
            },
          ])
          .then((data) => {
            const packagePath = `${projectName}/package.json`;
            const packageContent = fs.readFileSync(packagePath, "utf-8");
            var packageRes = handlebars.compile(packageContent)(data);
            fs.writeFileSync(packagePath, packageRes);
            console.log(logSymbols.success, chalk.green("初始化模板成功"));
          });
      }
    );
  });
program
  .command("list")
  .alias("ls")
  .description("查看可用项目模块")
  .action(() => {
    for (const key in templates) {
      console.log(templates[key].dec);
    }
  });
program.parse(process.argv);
