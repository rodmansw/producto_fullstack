const csv = require('csv-parser');
const fs = require('fs');

const rows = []

fs.createReadStream('puntos_examen_fullstack.csv')
  .pipe(csv())
  .on('data', (row) => {
    rows.push(row)
  })
  .on('end', () => {
    const pointsQuery = `INSERT INTO public.points ("the_geom", "cartodb_id", "tipo", "latitide", "longitude", "color") VALUES
      ${rows
        .map(
          (item) =>
            `('${item.the_geom}','${item.cartodb_id}','${item.tipo}','${item.latitide}','${item.longitude}','${item.color}')`
        )
        .join(',')};
    `

    fs.writeFileSync('points.sql', pointsQuery)
    console.log('CSV file successfully processed');
  });
