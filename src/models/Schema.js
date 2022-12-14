const { model, Schema } = require('mongoose');

const Schemaa = new Schema(
	{
		title: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		cell_arr: {
			type: String,
			required: true,
		},
		size: {
			type: Number,
			required: true,
		},
		rating: {
			type: [Number],
			required: true,
		},
		ratingAvg: {
			type: Number,
		},
		creator: {
			type: String,
			ref: 'User',
			required: true,
		},
		creatorName: {
			type: String,
			ref: 'User',
			required: true,
		},
		userRated: {
			type: [Object],
		},
	},
	{ timestamps: true }
);

module.exports = model('Schema', Schemaa);
