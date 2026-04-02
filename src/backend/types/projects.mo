import Common "common";

module {
  public type Project = {
    id : Common.ProjectId;
    name : Text;
    description : Text;
    createdAt : Common.Timestamp;
    order : Nat;
  };
};
