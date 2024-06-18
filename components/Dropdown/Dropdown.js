import React, { useState } from "react";
import { select__wrapper, select, selected__info } from "./Dropdown.module.css";

const Dropdown = ({ scales, mode }) => {
	const [selectedOption, setSelectedOption] = useState("");

	const handleChange = (event) => {
		setSelectedOption(event.target.value);
	};

	return (
		<div className={select__wrapper}>
			<select className={select} value={selectedOption} onChange={handleChange}>
				<option value="">Select an option</option>
				{scales.map((option, idx) => (
					<option key={idx} value={option.value}>
						{option[0]}
					</option>
				))}
			</select>
			{selectedOption && (
				<p className={selected__info}>
					Selected scale: {selectedOption}
					{mode}
				</p>
			)}
		</div>
	);
};

export default Dropdown;
