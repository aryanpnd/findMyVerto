const std = {
    name: 'Ishaant Kumar Singh',
    'registration no.': '12203987',
    'rollNo.': '\n' +
      '                                        Roll No -\n' +
      '                                        RK22UPB47 (Term:223241)',
    'section and group.': '\n' +
      '                                        Group -\n' +
      '                                        2 (Section:K22UP)',
    program: ' Programme -  P132-NNM::B.Tech. CSE -  Data Science with ML  View Programme Outcome'
  }

const p = std.program
console.log(p.split("Programme -")[1].split("View Programme Outcome")[0].trim());  