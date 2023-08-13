async function getgateinfo(gatename) {
    try {
        let req = await fetch('https://itgg-core.iservkmitl.tech/api/v1/gates');
        if (req.ok) {
        }
        let reqj = await req.json();
        let result
        reqj.items.forEach(element => {
            if (element.gate_name.toLowerCase() === gatename.toLowerCase()) {
                result = element
            }
        });
        return result
    } catch (error) {
        console.error(error);
    }
}

module.exports = { getgateinfo }