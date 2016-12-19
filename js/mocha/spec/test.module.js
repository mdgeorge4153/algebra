define(["SampleModule", "lib/jsverify"],
function(SampleModule, jsc) {
  describe("Sample Module", function() {
    // note: jsverify is trying to access "process", which seems to be defined
    // incorrectly by someone or other.
    process.argv=[];

    jsc.property("identity", "nat", function(i) { return true; });

    it('should have a name', function() {
      expect(SampleModule.name).to.be.a("string");
      expect(SampleModule.name).to.equal("sample");
    });
    
    it('should state the purpose', function() {
      expect(SampleModule.purpose).to.equal("AMD testing");
    });

    it('should have its own dependencies', function() {
      expect(SampleModule.dependency).to.equal("Module B");
    });

    it('should have its own dependencies', function() {
      expect(SampleModule.dependency).to.equal("Module B");
    });
  });
  
	return {
		name: "modulespec"
	}
});
