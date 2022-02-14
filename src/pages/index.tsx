import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async function () {
	const date = new Date();

	return {
		redirect: {
			statusCode: 303,
			destination: `/hiring/${date.getFullYear()}/${date.getMonth()}`
		}
	};
};

export default function RootIndexPage () {
	return <div />;
}
