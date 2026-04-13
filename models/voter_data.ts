import mongoose from 'mongoose';
/*object is already there so we dont need to create it again, we can just use it and export it*/
const VoterSchema = new mongoose.Schema(
  {
    aadhaar: { type: String, required: true, unique: true },
    dob: { type: String, required: true },
    // Allow Atlas seed docs with only aadhaar + dob; selection set when voting
    selection: { type: String, default: "" },
    hasVoted: { type: Boolean, default: false },
  },
  { timestamps: true, collection: "Voter" }
);

// Check if model exists, otherwise create it
const Voter = mongoose.models.Voter || mongoose.model('Voter', VoterSchema);

export default Voter;