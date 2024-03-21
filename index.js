const fs = require('fs');
const cheerio = require('cheerio');

function orderClasses(htmlContent) {
    const $ = cheerio.load(htmlContent);
    
    // Selecciona todos los elementos HTML que tienen atributo "class"
    $('[class]').each((index, element) => {
        const classes = $(element).attr('class').split(' ');

        // Ordena las clases según el criterio que definas
        classes.sort((a, b) => {
            // Aquí puedes definir tu criterio de ordenamiento
            // Por ejemplo, ordenar las clases alfabéticamente
            return a.localeCompare(b);
        });

        // Establece las clases ordenadas de nuevo en el elemento
        $(element).attr('class', classes.join(' '));
    });

    return $.html();
}

function processDirectory(directoryPath) {
    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            console.error('Error al leer el directorio', err);
            return;
        }

        files.forEach(file => {
            const filePath = `${directoryPath}/${file}`;
            fs.stat(filePath, (err, stats) => {
                if (err) {
                    console.error('Error al obtener estadísticas del archivo', err);
                    return;
                }

                if (stats.isDirectory()) {
                    // Si es un directorio, llamar recursivamente a la función con el nuevo directorio
                    processDirectory(filePath);
                } else if (stats.isFile() && file.endsWith('.html')) {
                    // Si es un archivo HTML, procesarlo
                    fs.readFile(filePath, 'utf8', (err, data) => {
                        if (err) {
                            console.error('Error al leer el archivo HTML', err);
                            return;
                        }

                        const orderedHtml = orderClasses(data);

                        // Guarda el HTML modificado en el mismo archivo
                        fs.writeFile(filePath, orderedHtml, err => {
                            if (err) {
                                console.error('Error al escribir en el archivo HTML', err);
                            } else {
                                console.log(`Clases ordenadas en el archivo: ${filePath}`);
                            }
                        });
                    });
                }
            });
        });
    });
}

// Directorio actual
const currentDirectory = process.cwd();
processDirectory(currentDirectory);
