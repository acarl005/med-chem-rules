
fetch('/h_bond_acceptors')
.then(res => res.json())
.then(data => {
  const labels = data.map(obj => obj.h_bond_acceptor_count)
  const values = data.map(obj => obj.total)
  plot('#ct-chart-h-bond', labels, values, 'Number of H-bond Acceptors')
})

fetch('/molecular_weights')
.then(res => res.json())
.then(data => {
  const labels = data.map(obj => obj.weight_interval)
  const values = data.map(obj => obj.total)
  plot('#ct-chart-molecular-weights', labels, values, 'Molecular Weight (Daltons)')
})

function plot(cssSelector, labels, values, xAxisTitle) {
  const max = Math.max.apply(null, values)
  const axisX = { showLabel: true }
  // show fewer labels if there are a ton of them
  if (labels.length > 60) {
    axisX.labelInterpolationFnc = (value, index) => {
      return index % 5  === 0 ? value : null;
    }
  }
  var chart = new Chartist.Bar(cssSelector, {
    labels,
    series: [ values ]
  }, {
    axisX,
    axisY: {
      onlyInteger: true
    },
    plugins: [
      Chartist.plugins.ctAxisTitle({
        axisX: {
          axisTitle: xAxisTitle,
          axisClass: 'ct-axis-title',
          offset: { x: 0, y: 30 },
          textAnchor: 'middle'
        },
        axisY: {
          axisTitle: 'Number of Compounds',
          axisClass: 'ct-axis-title',
          offset: { x: 0, y: 0 },
          textAnchor: 'middle',
          flipTitle: false
        }
      })
    ]
  })

  // on each draw event, overwrite the default bar color with something scaled to the maximum value
  chart.on('draw', function(context) {
    if(context.type === 'bar') {
      context.element.attr({
        style: 'stroke: hsl(' + Math.floor(Chartist.getMultiValue(context.value) / max * 100) + ', 50%, 50%);'
      });
    }
  });
}
