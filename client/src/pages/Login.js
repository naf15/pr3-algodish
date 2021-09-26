import { Segment, Form, Grid, Message, Icon } from "semantic-ui-react";
import { Link } from "react-router-dom";
import MainButton from "../components/MainButton";

const Login = () => {
	return (
		<Segment basic padded="very">
			<Grid columns={3}>
				<Grid.Row>
					<Grid.Column></Grid.Column>
					<Grid.Column>
						<Segment raised>
							<div>
								<Message
									attached
									header="Account Login"
									content="Enter your credentials to login into your account"
								/>
								<Form className="attached fluid segment">
									<Form.Input label="Email" placeholder="email" type="email" />
									<Form.Input
										label="Password"
										placeholder="password"
										type="password"
									/>
									<MainButton color="blue" title="Login"></MainButton>
								</Form>
								<Message attached="bottom" warning>
									<Icon name="user" />
									New user?&nbsp;
									<Link to="/signup">Sign up</Link>
									&nbsp;instead.
								</Message>
							</div>
						</Segment>
					</Grid.Column>
					<Grid.Column></Grid.Column>
				</Grid.Row>
			</Grid>
		</Segment>
	);
};
export default Login;