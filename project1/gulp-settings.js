const devDir = 'dev';
const publicDir = 'prod';

module.exports = {
	publicDir,
	devDir,
	scssDir: {
		entry: `${devDir}/scss`,
		output: `${publicDir}/assets/css`,
		mainFileName: 'style',
		mainFileOutput: publicDir
	},
	jsDir: {
		entry: `${devDir}/js`,
		output: `${publicDir}/assets/js`
	},
	imagesDir: {
		entry: `${devDir}/assets/img`,
		output: `${publicDir}/assets/img`
	}
};
