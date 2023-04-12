const featureAllowed = require('../modal/FeatureAllowedModel');

exports.addFeatureAllowedData = async(req,res) =>{
  try{
    const featureAdded = await featureAllowed.create(req.body)
    if(featureAdded){
      res.status(201).json({message:"Created successfully",data:featureAdded})
    }else{
      res.status(400).send({error:"Something wrong Please try again"})
    }
  }catch(err){
    res.status(500).send({error:err?.message})
  }
}

exports.getFeatures = async (req,res) =>{
  try{
    const features = await featureAllowed.aggregate([
      {
        $group: {
          _id: null,
          docs: {
            $mergeObjects: {
              $arrayToObject: [
                [
                  {
                    k: {
                      // "$toString": "$_id"
                      $toString: "$checkname",
                    },
                    v: "$$ROOT",
                  },
                ],
              ],
            },
          },
        },
      },
      {
        $replaceWith: "$docs",
      },
    ]);
    res.status(200).send(features)
  }
  catch(err){
    res.status(500).send({error:err?.message})
  }
}

exports.updateFeature = async(req,res)=>{
  try{
    const featureUpdated = await featureAllowed.findByIdAndUpdate(req.params.id,req.body)
    res.status(204).send(featureUpdated)
  }catch(err){
    res.status(500).send({error:err?.message})
  }
}