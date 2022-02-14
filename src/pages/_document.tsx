import NextDocument, {
	Html, Head, Main, NextScript
} from "next/document";

export default class Document extends NextDocument {
	render () {
		return (
			<Html>
				<Head>
					<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
					{/* eslint-disable-next-line max-len */}
					<link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&family=Noto+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}
