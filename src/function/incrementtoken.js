async function incrementtoken(token, gateid) {
    await fetch('https://itgg-core.iservkmitl.tech/api/v1/gates/increment', {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "_id": gateid, "amount": token })
    })
        .then((res) => {
            if (res.ok) {
                console.log(`${token} Token has been added`);
            }
        })
}

module.exports = { incrementtoken }