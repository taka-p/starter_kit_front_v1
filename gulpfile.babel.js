/**
 * 同名のファイルがgulp/tasks/, gulp/config/配下に一対に存在
 * gulp dev : ES6のprecompile、webpackによる依存解決
 * gulp prod: ES6のprecompile、webpackによる依存解決、uglify（の予定）
 */

import requireDir from 'require-dir';
requireDir('./gulp/tasks', { recurse: true });
