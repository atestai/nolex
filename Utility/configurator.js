import { readdir, readFile, stat } from 'node:fs/promises';
import path,{ join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class IniParser {
    constructor() {
        this.data = {};
        this.errors = [];
        this.currentSection = null;
    }

    parseLine(line, lineNumber) {
        const trimmed = line.trim();

        if (trimmed === '') {
            return;
        }

        if (trimmed.startsWith('#') || trimmed.startsWith(';')) {
            return;
        }

        //[session]
        const sectionMatch = trimmed.match(/^\[([^\]]+)\]$/);
        if (sectionMatch) {
            this.currentSection = sectionMatch[1];
            if (!this.data[this.currentSection]) {
                this.data[this.currentSection] = {};
            }
            return;
        }

        //[Key-value]
        const keyValueMatch = trimmed.match(/^([^=]+)=(.*)$/);
        if (keyValueMatch) {
            if (!this.currentSection) {
                this.errors.push({
                    line: lineNumber,
                    message: `Key-value outside of a section: "${trimmed}"`
                });
                return;
            }

            const key = keyValueMatch[1].trim();
            let value = keyValueMatch[2].trim();

            if (value.startsWith('"') && value.endsWith('"')) {
                value = value.slice(1, -1);
            }

            this.data[this.currentSection][key] = value;
            return;
        }

        this.errors.push({
            line: lineNumber,
            message: `Syntax error: "${trimmed}"`
        });
    }

    parse(content) {
        this.data = {};
        this.errors = [];
        this.currentSection = null;

        const lines = content.split(/\r?\n/);

        for (const [index, line] of lines.entries()) {
            this.parseLine(line, index + 1);
        }

        return {
            data: this.data,
            errors: this.errors,
            hasErrors: this.errors.length > 0
        };
    }
}


async function parseIniDirectory(directoryPath) {
    const results = [];

    try {
        const files = await readdir(directoryPath);

        for (const file of files) {
            const filePath = join(directoryPath, file);
            const fileStat = await stat(filePath);

            // Process only files (not directories) with .ini extension
            if (fileStat.isFile() && extname(file).toLowerCase() === '.ini') {
                console.log(`\nProcessing: ${file}`);

                try {
                    const content = await readFile(filePath, 'utf8');
                    const parser = new IniParser();
                    const result = parser.parse(content);

                    results.push({
                        file,
                        path: filePath,
                        ...result
                    });

                    if (result.hasErrors) {
                        console.log(`✗  ERRORS found in ${file}:`);
                        result.errors.forEach(err => {
                            console.log(`   Line ${err.line}: ${err.message}`);
                        });
                    } else {
                        console.log(`✓ ${file} parsed successfully`);
                    }

                } catch (err) {
                    console.error(`Error reading file ${file}:`, err.message);
                    results.push({
                        file,
                        path: filePath,
                        error: err.message
                    });
                }
            }
        }

    } catch (err) {
        console.error(`Error reading directory:`, err.message);
        throw err;
    }

    return results;
}

export const initializeConfigurator =  async () => {

    try {
        const results = await parseIniDirectory(join(__dirname, '../appConfigs'));
        if (results.length === 0) {
            console.warn('No .ini configuration files found in the directory.');
        } else {
            console.info(`✓ Parsed ${results.length} configuration file(s).`);
        }
        
    } catch (error) {
        console.error('Error during initialization:', error);
    }
}