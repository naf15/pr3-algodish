import { Message, Form, Icon, Header, Button } from "semantic-ui-react";
import MainButton from "../MainButton";
import { useMutation } from "@apollo/client";
import { CREATE_NEW_DISH, ADD_STEP_TO_DISH_INSTRUCTIONS } from "../../utils/mutations";
import React, { useState } from "react";
import { generateRandomId } from "../TestDishes/index";
import Auth from "../../utils/auth";
import { parse } from "graphql";

const CreateDishForm = () => {
	const [formState, setFormState] = useState({
		title: "",
		username: Auth.getUsername(),
		userId: Auth.getUserId(),
		description: "",
		image: "",
		ingredients: "",
		recipe: "",
		numSteps: 1,
		instruction: [],
		cook_time: generateRandomId(), //parseInt('233')
		steps : [{"step-1": ' ', "time-1": 0}],
		stepsArray: [1]
	});

	const [createNewDish] = useMutation(CREATE_NEW_DISH);
	const [addInstructionsToDish] = useMutation(ADD_STEP_TO_DISH_INSTRUCTIONS)

	const handleChange = (event) => {
		const { name, value } = event.target;
		const num = event.target.valueAsNumber;
		
		if (name.includes('step-')){
			const steps = formState.steps;

			steps.forEach( (item, index) => {
				if (item[name]){
					steps[index][name] = value
				}
			})

			setFormState({
				...formState,
				steps,
			});
		} else if (name.includes('time-')){
			const steps = formState.steps;

			steps.forEach( (item, index) => {
				if (item[name] >= 0) {
					steps[index][name] = num;
				}; 
			});

			setFormState({
				...formState,
				steps,
			});
		} else {
			setFormState({
				...formState,
				[name]: value,
			});
		}
	};

	const incrementNumSteps = () => {
		const newNumSteps = parseInt(formState.numSteps) + 1;
		const stepsArray = formState.stepsArray;
		const steps = formState.steps;
		stepsArray.push(newNumSteps)

		let item = {}
			
		item["step-" + newNumSteps] = ' ';
		item["time-" + newNumSteps] = 0;
			
		steps.push(item)
		
		
		setFormState({
			...formState,
			numSteps: newNumSteps,
			stepsArray,
			steps
		});
		console.log(formState)
	};

	const decrementNumSteps = () => {
		const newNumSteps = parseInt(formState.numSteps) - 1;

		if (newNumSteps > 0){
			const stepsArray = formState.stepsArray;
			stepsArray.pop();
			
			const steps = formState.steps;
			steps.pop();
	
			setFormState({
				...formState,
				numSteps: newNumSteps,
				stepsArray,
				steps
			});
		}
	}

	const handleFormSubmit = async (event) => {
		event.preventDefault();
		try {
			const { data } = await createNewDish({
				variables: { 
					title: formState.title,
					description: formState.description,
					image: formState.image,
					ingredients: formState.ingredients,
					cook_time: formState.cook_time,
					userId: formState.userId 
				},
			});
			const currentDishId = data.uploadDish._id;

			formState.steps.forEach( async (value, index) => {
				const currentStep = value[`step-${index}`]
				const currentTime = value[`time-${index}`]

				const newStep = await addInstructionsToDish({
					step: currentStep,
					time: currentTime,
					dishId: currentDishId
				}) 
			})

			window.location = `/dish/${currentDishId}`;
			} catch (e) {
				console.error(e);
		}
	};


	return (
		<div>
			<Message>
				<Header as="h3">Create a new dish</Header>
			</Message>
			<Form className="attached fluid segment" onSubmit={handleFormSubmit}>
			
				<Form.Input
					label="Dish Title"
					placeholder="name of dish"
					type="text"
					value={formState.title}
					onChange={handleChange}
					name="title"
				/>
				<Form.Input
					label="Description"
					placeholder="description"
					type="text"
					value={formState.description}
					onChange={handleChange}
					name="description"
				/>
				<Form.Input
					label="Image URL"
					placeholder="www.example.com/image/path"
					type="text"
					value={formState.image}
					onChange={handleChange}
					name="image"
				/>
				{formState.stepsArray.map( (id) => (
					
					<Form.Group key={id}>
						<Form.Input
							name={`step-${id}`}
							label={`Step ${id}`}
							placeholder="boil water"
							type="text"
							width={12}
							onChange={handleChange}
							data-field="step"
						/>
						<Form.Input
							name={`time-${id}`}
							label="Time"
							placeholder="minutes"
							type="number"
							width={4}
							onChange={handleChange}
							data-field='time'
						/>
					</Form.Group>
					
				))}
				<Button.Group size='small'>
    				<Button onClick={decrementNumSteps}>-</Button>
    				<Button.Or />
    				<Button onClick={incrementNumSteps}>+</Button>
  				</Button.Group>
				<Form.Input
					label="Cook Time"
					placeholder="cook time"
					type="text"
					value={formState.cook_time}
					onChange={handleChange}
					name="cook_time"
				/>
				<Form.TextArea
					label="Dish Ingredients"
					placeholder="example: water, red peppers, oil..."
					rows={5}
					value={formState.ingredients}
					onChange={handleChange}
					name="ingredients"
				/>
				<MainButton title="Submit Dish"></MainButton>
			</Form>
			<Message attached="bottom">
				<Icon name="utensils" />
				Properly describe the steps and ingredents need to prepare this dish.
			</Message>
		</div>
	);
};

export default CreateDishForm;
