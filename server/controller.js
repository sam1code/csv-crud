const fs = require("fs");
const csv = require("csv-parser");
const dataFile = "./data.csv";

const defaultData = [
  {
    "First Name": "Ram",
    "Last Name": "Pal",
    Email: "rampal@mail.com",
    "User Name": "rampal12",
    Phone: "9876543210",
  },
  {
    "First Name": "Azam",
    "Last Name": "Khan",
    Email: "azamkhan@mail.com",
    "User Name": "azamk121",
    Phone: "12345676543",
  },
  {
    "First Name": "Sam",
    "Last Name": "Kumar",
    Email: "samc@mail.com",
    "User Name": "samc",
    Phone: "8765445678",
  },
  {
    "First Name": "Luies",
    "Last Name": "Philips",
    Email: "luiesp@mail.com",
    "User Name": "luiesphilips",
    Phone: "9876543210",
  },
  {
    "First Name": "Raj Kumar",
    "Last Name": "Rao",
    Email: "rrr@mail.com",
    "User Name": "srajm",
    Phone: "9876543210",
  },
];

function readData() {
  return new Promise((resolve, reject) => {
    const data = [];
    fs.createReadStream(dataFile)
      .pipe(csv())
      .on("data", (row) => {
        data.push(row);
      })
      .on("end", () => {
        resolve(data);
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}

// Get all data
exports.getData = async (req, res) => {
  if (!fs.existsSync(dataFile) || req.query.reset === "true") {
    const header = Object.keys(defaultData[0]).join(",");
    const rows = defaultData.map((item) => Object.values(item).join(","));
    const csvData = `${header}\n${rows.join("\n")}`;

    fs.writeFileSync(dataFile, csvData, "utf-8");

    if (req.query.csv === "true") {
      res.download(dataFile);
      return;
    } else {
      res.json(defaultData);
      return;
    }
  }

  if (req.query.csv === "true") {
    res.download(dataFile);
    return;
  }

  const data = await readData();
  res.json(data);
};

// Create data
exports.createData = async (req, res) => {
  const newData = req.body;
  let data = await readData();
  if (!data) {
    data = [];
  }
  data.push(newData);

  const header = Object.keys(data[0]).join(",");
  const rows = data.map((item) => Object.values(item).join(","));
  const csvData = `${header}\n${rows.join("\n")}`;

  fs.writeFileSync(dataFile, csvData, "utf-8");

  res.json({ message: "Data created successfully", data });
};

// Update data
exports.updateData = async (req, res) => {
  const ind = req.query.ind;
  if (!ind) {
    res.status(400).json({ error: "Invalid index" });
    return;
  }

  const newData = req.body;
  let data = await readData();
  if (!data) {
    data = [];
  }

  if (data?.length > ind) {
    data[ind] = newData;

    const header = Object.keys(data[0]).join(",");
    const rows = data.map((item) => Object.values(item).join(","));
    const csvData = `${header}\n${rows.join("\n")}`;

    fs.writeFileSync(dataFile, csvData, "utf-8");

    res.json({ message: "Data updated successfully", data });
  } else {
    res.status(404).json({ error: "Data not found" });
  }
};

// Delete data
exports.deleteData = async (req, res) => {
  const data = await readData();
  const ind = req.query.ind;

  if (data?.length > ind) {
    // remove the item from the array at the index
    const header = Object.keys(data[0]).join(",");
    let csvData;
    if (data.length > 1) {
      data.splice(ind, 1);
      const rows = data.map((item) => Object.values(item).join(","));
      csvData = `${header}\n${rows.join("\n")}`;
    } else {
      csvData = `${header}\n`;
    }

    fs.writeFileSync(dataFile, csvData, "utf-8");

    res.json({ message: "Data deleted successfully", data });
  } else {
    res.status(404).json({ error: "Data not found" });
  }
};
