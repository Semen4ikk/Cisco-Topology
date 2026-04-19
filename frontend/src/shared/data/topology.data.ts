export const mockHybridNetwork = {
    nodes: [
        // Сервера кольцевые
        { data: { id: "server-1", label: "Server 1", type: "server", status: "online", cpu: "80%", ram: "64TB" }, classes: "ring", },
        { data: { id: "server-2", label: "Server 2", type: "server", status: "online", cpu: "45%", ram: "32TB" }, classes: "ring", },
        { data: { id: "server-3", label: "Server 3", type: "server", status: "online", cpu: "80%", ram: "4TB" }, classes: "ring", },
        { data: { id: "server-4", label: "Server 4", type: "server", status: "online", cpu: "90%", ram: "64GB" }, classes: "ring", },
        { data: { id: "server-5", label: "Server 5", type: "server", status: "online", cpu: "80%", ram: "16GB" }, classes: "ring", },
        { data: { id: "server-6", label: "Server 6", type: "server", status: "online", cpu: "80%", ram: "8GB" }, classes: "ring", },

        // компы дерево
        { data: { id: "router-1", label: "router 1", type: "router", status: "online", cpu: "80%", ram: "64GB" }, classes: "tree", },
        { data: { id: "computer-2", label: "computer 2", type: "computer", status: "online", cpu: "80%", ram: "64GB" }, classes: "tree", },
        { data: { id: "router-3", label: "router 3", type: "router", status: "online", cpu: "80%", ram: "128GB" }, classes: "tree", },
        { data: { id: "computer-12", label: "computer 12", type: "computer", status: "online", cpu: "50%", ram: "64GB" }, classes: "tree", },
        { data: { id: "computer-13", label: "computer 13", type: "computer", status: "offline", cpu: "70%", ram: "256GB" }, classes: "tree", },


        //компы зыезда
        { data: { id: "computer-4", label: "computer 4", type: "computer", status: "online", cpu: "80%", ram: "64GB" }, classes: "star", },
        { data: { id: "router-5", label: "router 5", type: "router", status: "online", cpu: "80%", ram: "64GB" }, classes: "star", },
        { data: { id: "computer-6", label: "computer 6", type: "computer", status: "online", cpu: "80%", ram: "64GB" }, classes: "star", },
        { data: { id: "computer-7", label: "computer 7", type: "computer", status: "online", cpu: "80%", ram: "64GB" }, classes: "star", },
        { data: { id: "computer-8", label: "computer 8", type: "computer", status: "online", cpu: "80%", ram: "64GB" }, classes: "star", },
        { data: { id: "computer-9", label: "computer 9", type: "computer", status: "online", cpu: "80%", ram: "64GB" }, classes: "star", },
        { data: { id: "computer-10", label: "computer 10", type: "computer", status: "online", cpu: "80%", ram: "64GB" }, classes: "star", },
        { data: { id: "computer-11", label: "computer 11", type: "computer", status: "online", cpu: "80%", ram: "64GB" }, classes: "star", },
    ],
    edges: [
        // сервера кольцо
        { data: { id: "link-1", source: "server-1", target: "server-2", label: "1Gbps", bandwidth: 1000 } },
        { data: { id: "link-2", source: "server-2", target: "server-3", label: "1Gbps", bandwidth: 1000 } },
        { data: { id: "link-3", source: "server-3", target: "server-4", label: "1Gbps", bandwidth: 1000 } },
        { data: { id: "link-4", source: "server-4", target: "server-5", label: "1Gbps", bandwidth: 1000 } },
        { data: { id: "link-5", source: "server-5", target: "server-6", label: "1Gbps", bandwidth: 1000 } },
        { data: { id: "link-6", source: "server-6", target: "server-1", label: "1Gbps", bandwidth: 1000 } },

        // Компы дерево
        { data: { id: "link-7", source: "server-4", target: "router-1", label: "1Gbps", bandwidth: 1000 } },
        { data: { id: "link-8", source: "router-1", target: "computer-2", label: "1Gbps", bandwidth: 1000 } },
        { data: { id: "link-9", source: "router-1", target: "router-3", label: "1Gbps", bandwidth: 1000 } },
        { data: { id: "link-18", source: "router-3", target: "computer-12", label: "1Gbps", bandwidth: 1000 } },
        { data: { id: "link-19", source: "router-3", target: "computer-13", label: "1Gbps", bandwidth: 1000 } },

        //омпы звезда
        { data: { id: "link-10", source: "server-5", target: "router-5", label: "1Gbps", bandwidth: 1000 } },
        { data: { id: "link-11", source: "computer-4", target: "router-5", label: "1Gbps", bandwidth: 1000 } },
        { data: { id: "link-12", source: "router-5", target: "computer-6", label: "1Gbps", bandwidth: 1000 } },
        { data: { id: "link-13", source: "router-5", target: "computer-7", label: "1Gbps", bandwidth: 1000 } },
        { data: { id: "link-14", source: "router-5", target: "computer-8", label: "1Gbps", bandwidth: 1000 } },
        { data: { id: "link-15", source: "router-5", target: "computer-9", label: "1Gbps", bandwidth: 1000 } },
        { data: { id: "link-16", source: "router-5", target: "computer-10", label: "1Gbps", bandwidth: 1000 } },
        { data: { id: "link-17", source: "router-5", target: "computer-11", label: "1Gbps", bandwidth: 1000 } },
    ]
};