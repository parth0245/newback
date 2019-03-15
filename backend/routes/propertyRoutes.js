const express = require("express");
const multer = require("multer");
const Property = require("../models/property");
const router = express.Router();

const MIME_TYPE_MAP = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/jpg": "jpg"
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log('file.mimetype10', file.mimetype);
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error("Invalid mime type");
        if (isValid) {
            error = null;
        }
        cb(error, "backend/images");
    },
    filename: (req, file, cb) => {
        const name = file.originalname
            .toLowerCase()
            .split(" ")
            .join("-");
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name + "-" + Date.now() + "." + ext);
    }
});


router.post(
    "",
    multer({ storage: storage }).array("image", 12),
    (req, res, next) => {
        const url = req.protocol + "://" + req.get("host");
        var files = req.files;
        var imagesPath = [];
        if (files) {
            files.forEach(function (file) {
                imagesPath.push(
                    {
                        name: file.filename,
                        file: url + "/" + file.filename
                    }
                );
            })
        } else {
            console.log('no file found')
        }
        const property = new Property({
            email: req.body.email,
            mobile: req.body.mobile,
            date: req.body.date,
            propertyCaption: req.body.propertyCaption,
            parking: req.body.parking,
            propertyFor: req.body.propertyFor,
            propertyType: req.body.propertyType,
            propertyLocation: req.body.propertyLocation,
            societyName: req.body.societyName,
            address: req.body.address,
            propertyBedrooms: req.body.propertyBedrooms,
            propertyBalconies: req.body.propertyBalconies,
            propertyTotalFloors: req.body.propertyTotalFloors,
            propertyYourFloor: req.body.propertyYourFloor,
            propertyFurnishedStatus: req.body.propertyFurnishedStatus,
            propertyBathrooms: req.body.propertyBathrooms,
            propertyConstructionAllowed: req.body.propertyConstructionAllowed,
            propertyOpenSides: req.body.propertyOpenSides,
            propertyCoveredArea: req.body.propertyCoveredArea,
            propertyCoveredAreaUnit: req.body.propertyCoveredAreaUnit,
            propertyCarpetArea: req.body.propertyCarpetArea,
            propertyCarpetAreaUnit: req.body.propertyCarpetAreaUnit,
            availablility: req.body.availablility,
            propertyStatus: req.body.propertyStatus,
            ageOrAvailableFrom: req.body.ageOrAvailableFrom,
            propertyPrice: req.body.propertyPrice,
            propertyMainPrice: req.body.propertyMainPrice,
            propertyOtherPrice: req.body.propertyOtherPrice,
            dateAvailableFrom: req.body.dateAvailableFrom,
            propertyDesc: req.body.propertyDesc,
            propertyLandmark: req.body.propertyLandmark,
            images: imagesPath
        });
        property.save().then(createdPost => {
            res.status(201).json({
                message: "Post added successfully",
                post: {
                    ...createdPost,
                    id: createdPost._id
                }
            });
        });
    }
);


router.get("/all-sale-post", (req, res, next) => {
    Property.find().then(post => {
        if (post) {
            var fpost = post;
            fpost.forEach(element => {
                element.connects = [];
            });
            res.status(200).json([
                ...fpost
            ]);
        } else {
            res.status(404).json({ message: "No Properties found!" });
        }
    });
});


router.post("/SaleByUser", (req, res, next) => {
    Property.find({ email: req.body.email }).then(post => {
        if (post) {
            res.status(200).json(post);
        } else {
            res.status(404).json({ message: "No Properties found!" });
        }
    });
});

router.post("/getPropDetails", (req, res, next) => {
    Property.find({ _id: req.body.id }).then(post => {
        var connected = false;
        if (post) {
            // post[0].connects.forEach(element => {
            //     if(element.connects.email == req.body.email){
            //         connected = true;
            //     }
            // });
            res.status(200).json([...post , {connected:true}]);
        } else {
            res.status(404).json({ message: "No Properties found!" });
        }
    });
});

// router.post("/addContactToOwnerProperty", (req, res, next) => {
//     console.log(req.body);
//     let fetchedProp = {};
//     let contact = {
//         contactName: req.body.contactName,
//         contactEmail: req.body.contactName,
//         contactMobile: req.body.contactName
//     }
//     Property.findOne({ _id: req.body.propId }).then(property => {
//         if (!property) {
//             return res.status(401).json({
//                 message: 'Property Not Found1'
//             });
//         }
//         fetchedProp = property;
//         console.log(fetchedProp);
//         return true;
//     }).then(result => {
//         console.log(result);
//         if (!result) {
//             return res.status(401).json({
//                 message: 'Property Not Found2'
//             });
//         }
//         //save Here
//         Property.updateOne()
//         res.status(200).json({
//             property: fetchedProp
//         });
//     }).catch(err => {
//         return res.status(401).json({
//             message: 'Property Not Found3', err: err
//         });
//     });



// });




router.post("/addContactToOwnerProperty", (req, res, next) => {
    let fetchedProp = {};
    let contact = {
        contactName: req.body.contactName,
        contactEmail: req.body.contactEmail,
        contactMobile: req.body.contactMobile
    }

    Property.update(
        { _id: req.body.propId },
        { $push: { connects: contact } },
        (err, data) => {
            if (!err) {
                return res.status(200).json({
                    status: 1,
                    message: 'Done.'
                });
            }
            else {
                return res.status(401).json({
                    status: 0,
                    message: 'Failed.'
                });
            }

        }
    )

});
module.exports = router;