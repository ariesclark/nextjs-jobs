import NextDocument, {
	Html, Head, Main, NextScript
} from "next/document";

export default class Document extends NextDocument {
	render () {
		return (
			<Html>
				<Head>
					<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
					<link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&family=Source+Sans+Pro:ital,wght@0,200;0,300;0,400;0,600;0,700;0,900;1,200;1,300;1,400;1,600;1,700;1,900&display=swap" rel="stylesheet" />
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}
