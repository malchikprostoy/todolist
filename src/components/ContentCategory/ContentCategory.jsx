import React, { useContext, useState } from 'react'
import { CustomContext } from '../../utils/Context'
import ContentCheckbox from './ContentCheckbox'
import { useForm } from 'react-hook-form'
import { v4 as uuidv4 } from 'uuid'
import axios from 'axios'
import { toast } from 'react-toastify'

function ContentCategory({ status }) {
	const { user, setUser } = useContext(CustomContext)
	const [show, setShow] = useState(false)
	const addTask = data => {
		let newTask = {
			...data,
			id: uuidv4(),
			isComplete: false,
		}
		let newCategories = user.categories.map(item => {
			if (item.categoryName === status) {
				return { ...item, task: [...item.task, newTask] }
			}
			return item
		})
		axios
			.patch(`http://localhost:4000/users/${user.id}`, {
				categories: newCategories,
			})
			.then(({ data }) => {
				setUser({
					...data,
					token: user.token,
				})
				localStorage.setItem(
					'user',
					JSON.stringify({
						...data,
						token: user.token,
					})
				)
				setShow(false)
				reset()
				toast('Задача добавлена')
			})
			.cath(err => toast(`Задача не добавлена, ${err.message}`))
	}
	const checkTask = data => {
		let has = user.categories
			.find(item => item.categoryName === status)
			.task.findIndex(item => item.taskTitle === data.taskTitle)

		if (has > -1) {
			toast('Данная задача уже имеется')
		} else {
			addTask(data)
		}
	}
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({ mode: 'onBlur' })
	return (
		<>
			<div className='content__top'>
				<h2 className='content__title'>{status}</h2>
				<span className='content__edit'>
					<svg
						width='15'
						height='15'
						viewBox='0 0 15 15'
						fill='#DFDFDF'
						xmlns='http://www.w3.org/2000/svg'
					>
						<path d='M0 12.0504V14.5834C0 14.8167 0.183308 15 0.41661 15H2.9496C3.05792 15 3.16624 14.9583 3.24123 14.875L12.34 5.78458L9.21542 2.66001L0.124983 11.7504C0.0416611 11.8338 0 11.9338 0 12.0504ZM14.7563 3.36825C14.8336 3.29116 14.8949 3.1996 14.9367 3.0988C14.9785 2.99801 15 2.88995 15 2.78083C15 2.6717 14.9785 2.56365 14.9367 2.46285C14.8949 2.36205 14.8336 2.27049 14.7563 2.19341L12.8066 0.24367C12.7295 0.166428 12.6379 0.105146 12.5372 0.0633343C12.4364 0.021522 12.3283 0 12.2192 0C12.1101 0 12.002 0.021522 11.9012 0.0633343C11.8004 0.105146 11.7088 0.166428 11.6318 0.24367L10.107 1.76846L13.2315 4.89304L14.7563 3.36825Z' />
					</svg>
				</span>
			</div>
			<ul className='content__menu'>
				{status !== 'all'
					? user.categories
							.find(item => item.categoryName === status)
							.task.map(item => (
								<li className='content__item' key={item.id}>
									<ContentCheckbox isComplete={item.isComplete} />
									{item.taskTitle}
									<span className='content__item-del'>
										<svg
											width='11'
											height='11'
											viewBox='0 0 11 11'
											fill='#E3E3E3'
											xmlns='http://www.w3.org/2000/svg'
										>
											<path d='M6.87215 5.5L10.7129 1.65926C10.8952 1.47731 10.9977 1.23039 10.9979 0.972832C10.9982 0.715276 10.8961 0.468178 10.7141 0.285898C10.5321 0.103617 10.2852 0.00108525 10.0277 0.000857792C9.77011 0.000630336 9.52302 0.102726 9.34074 0.284685L5.5 4.12542L1.65926 0.284685C1.47698 0.102404 1.22976 0 0.971974 0C0.714191 0 0.466965 0.102404 0.284685 0.284685C0.102404 0.466965 0 0.714191 0 0.971974C0 1.22976 0.102404 1.47698 0.284685 1.65926L4.12542 5.5L0.284685 9.34074C0.102404 9.52302 0 9.77024 0 10.028C0 10.2858 0.102404 10.533 0.284685 10.7153C0.466965 10.8976 0.714191 11 0.971974 11C1.22976 11 1.47698 10.8976 1.65926 10.7153L5.5 6.87458L9.34074 10.7153C9.52302 10.8976 9.77024 11 10.028 11C10.2858 11 10.533 10.8976 10.7153 10.7153C10.8976 10.533 11 10.2858 11 10.028C11 9.77024 10.8976 9.52302 10.7153 9.34074L6.87215 5.5Z' />
										</svg>
									</span>
								</li>
							))
					: ''}
			</ul>

			{show ? (
				<form
					noValidate
					className='content__add'
					onSubmit={handleSubmit(checkTask)}
				>
					<input
						{...register('taskTitle', {
							required: {
								message: 'Название задачи обязательно к заполнению',
								value: true,
							},
							minLength: {
								message: 'Минимальное количество слов должно быть 3',
								value: 3,
							},
						})}
						type='text'
						className='content__add-field'
						placeholder='Текст задачи'
					/>
					<span className='form__error'>
						{errors.taskTitle && errors.taskTitle.message}
					</span>
					<div className='content__add-actions'>
						<button className='content__add-btn'>Добавить задачу</button>
						<div className='content__add-close' onClick={() => setShow(false)}>
							Отмена
						</div>
					</div>
				</form>
			) : (
				<div className='content__bottom'>
					<span className='content__bottom-icon' onClick={() => setShow(true)}>
						<svg
							width='16'
							height='16'
							viewBox='0 0 16 16'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'
						>
							<path
								d='M8 1V15'
								stroke='#B4B4B4'
								strokeWidth='2'
								strokeLinecap='round'
								strokeLinejoin='round'
							/>
							<path
								d='M1 8H15'
								stroke='#B4B4B4'
								strokeWidth='2'
								strokeLinecap='round'
								strokeLinejoin='round'
							/>
						</svg>
					</span>
					<p className='content__bottom-text' onClick={() => setShow(true)}>
						Новая задача
					</p>
				</div>
			)}
		</>
	)
}

export default ContentCategory
