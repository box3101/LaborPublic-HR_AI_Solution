module.exports = {
	lintOnSave: false,
	devServer: {
		open: true,
		//pdf 강제성을 부여하기 위해 설정함.
		proxy: {
			'/pdf-proxy': {
				target: 'https://kr.object.ncloudstorage.com',
				changeOrigin: true,
				pathRewrite: { '^/pdf-proxy': '' }
			}
		}
	}
}
