const yup = require('yup');

exports.create = yup.object().shape({
	title: yup.string().required(),
	description: yup.string().required(),
	cell_arr: yup.string().required(),
	size: yup.number().required(),
	rating: yup.array().of(yup.number()).required(),
	ratingAvg: yup.number(),
	creator: yup.string().required(),
	creatorName: yup.string().required(),
	userRated: yup.array().of(yup.string()),
});
