const router = require("express").Router();
const ObjectId = require("mongoose").ObjectId;
const Form = require("../models/form-model");

const dummyForm = new Form({
	name: "test",
	fields: [
		{
			field_name: "a1",
			field_type: "text",
		},
		{
			field_name: "b1",
			field_type: "number",
		},
		{
			field_name: "a2",
			field_type: "text",
		},
		{
			field_name: "b3",
			field_type: "number",
		},
		{
			field_name: "a3",
			field_type: "text",
		},
		{
			field_name: "b3",
			field_type: "number",
		},
		{
			field_name: "c1",
			field_type: "date",
		},
		{
			field_name: "c2",
			field_type: "date",
		},
		{
			field_name: "d1",
			field_type: "button",
		},
		{
			field_name: "d2",
			field_type: "button",
		},
	],
	submittions:[
		{
			// userId: "g6zd5rg1ze65tg1z6tg51z6tg1z",
			values: [
				{
					field_name: "aaa", // field_id
					field_value: "hello", 
				},
				{
					field_name: "bbb", // field_id
					field_value: "2", 
				},
			]
		},
		{
			// userId: "5aertz6ert5z6ertzert6zer5ter",
			values: [
				{
					field_name: "aaa", // field_id
					field_value: "world", 
				},
				{
					field_name: "bbb", // field_id
					field_value: "3", 
				},
			]
		},
		{
			// userId: "5aertz6ert5z6ertzert6zer5ter",
			values: [
				{
					field_name: "zzz", // field_id
					field_value: "rami", 
				},
			]
		},
	]	
});


router.get("/form-to-submit/:id", async (req, res) => {
	const id = req.params.id;
	const form = await Form.findOne({ _id: id });
	res.status(200).json(form);
});

// submitted data of form
router.get("/data/:id", async (req, res) => {
	const id = req.params.id;
	// check mongoid

	const form = await Form.findOne({ _id: id });	
	const submittions = form.submittions;

	const columnNamesObj = {};
	const f = submittions.map(s => {
		const r = {};
		s.values.map( ({field_name, field_value}) =>{
			const key = field_name; 
			const value = field_value; 
			// console.log(`${key}: ${value}`);
			r[key] = value;
			columnNamesObj[key] = "";
		})
		return r;
	});

	return res.send({ data: f, columns: Object.keys(columnNamesObj)});
});

router.get("/:id", async (req, res) => {
	const forms = await Form.find({});
	return res.send(forms);
});

router.get("/test/f", async (req, res) => {
	const forms = await Form.find({});
	return res.send(forms);
});

router.post("/", (req, res) => {
	// get data from request
	const newForm = dummyForm; //req.body;
	
	newForm.save((err, mongoResp) => {
		if (err || !mongoResp._id){
			return res.status(500).json({ "response": "Error: couldn't save form", "error": err});
		} else {
			return res.status(200).json({ "response": "Form saved"});
		}
	});
});

router.put("/:id", async(req, res) => {
	const id = req.params.id;
	
	// get data from request
	const newForm = req.body;

	Form.updateOne({ "_id": id }, newForm, (err, mongoResp) => {
		if (err){
			return res.status(500).json({ "response": "Error: couldn't update form", "error": err});
		} else {
			return res.status(200).json({ "response": "Form updated"});
		}
	});
});

router.delete("/:id", (req, res) => {
	const id = req.params.id
	
	Form.deleteOne({ "_id": id }, (err, mongoResp) => {
		if (err || mongoResp.deletedCount != 1){
			return res.status(500).json({ "response": "Error: couldn't delete form"});
		} else {
			return res.status(200).json({ "response": "Form deleted"});
		}
	});
});

module.exports = router;