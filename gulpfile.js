/* eslint-disable import/no-extraneous-dependencies */
const gulp = require('gulp');
const fs = require('fs-extra');
const build = require('./script/build');
const configs = require('./script/config');

const nodeEnv = process.env.NODE_ENV || 'development';
const src = './src';
const out = './dist';

console.log(`env:${nodeEnv} src:${src} out:${out}`);

if (!fs.existsSync(out)) {
  fs.mkdirSync(out);
}

/**
 * 删除已有发布文件，全部重新生成
 * @returns
 */
async function clean(cb) {
  // const toRemove = ['*.map'].map(cmd => `rm -rf ${cmd}`);
  // await exec.promise(`cd dist && ${toRemove.join(' && ')}`);
  await fs.emptyDir('./dist/');
  cb && cb();
}

/**
 * 同时生成umd、cjs、esm 三种格式输出文件
 */
const buildAll = gulp.series(clean, cb => {
  console.log('start build ...');
  build(configs, cb);
});

gulp.task('watch', () => {
  gulp.watch(`${src}/*.js`, gulp.series(['build']));
});

module.default = buildAll;
module.exports = {build: buildAll};
