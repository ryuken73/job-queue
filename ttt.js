const x = (a, ...args) => {
    console.log(args)
    console.log(a)
}

x(1,2,3,4)
x(1)