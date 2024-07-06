#!/usr/bin/env node

const { findRhymes, syllableCount } = require('./Algorithms.js');
const fs = require('fs');
const path = require('path');
const CG = require('console-grid');
const { Command } = require('commander');

const cli = new Command("haiku");

cli.description("Set of cli tools to aid in the creation of poems");

const defaultDictionaryPath = path.join(__dirname, "../dictionary.txt");
cli.command("find-rhymes")
	.description("Finds words that ryhmes with the input words")
	.argument("<WORD...>", "Words to find ryhmes for")
	.option("-n --num <NUM>", "Specify the desired number of matches", 10)
	.option("-d --dictionary <FILE>", "Specify the dictionary file path", defaultDictionaryPath)
	.action(findRhymesAction);

function findRhymesAction(args, options) {
	if (!fs.existsSync(options.dictionary)) {
		throw new Error("The dictionary file does not exist");
	}

	const dictionary = fs.readFileSync(options.dictionary, 'utf8').split('\n');

	let outputs = new Array();
	let columns = new Array();
	let rows = new Array();

	args.forEach((word) => {
		columns.push(word);
		outputs.push(findRhymes(word, options.num, dictionary));
	});

	for (let i = 0; i < options.num; i++) {
		let row = new Array();
		for (let j = 0; j < args.length; j++) {
			if (i >= outputs[j].length) {
				throw new Error(`Output ${columns[j]}[${i}] does not exist`);
			}
			row.push(outputs[j][i]);
		}
		rows.push(row);
	}

	CG({ "columns": columns, "rows": rows });
}

cli.command("count-syllables")
	.description("Counts the number of syllables in a text")
	.argument("<TEXT...>", "The texts to count syllables on")
	.action(syllableCountAction)

function syllableCountAction(args) {
	let columns = [''];
	for (let i = 0; i < args.length; i++) {
		columns.push({ "name": `Text ${i+1}`, "align": "center" });
	}

	let rows = [ ["Syllables:"] ];
	args.forEach((text) => {
		rows[0].push(syllableCount(text));
	});

	let options = { "headerVisible": args.length > 1 };

	CG({ "columns": columns, "rows": rows, "options": options });
}

cli.parse(process.argv);
