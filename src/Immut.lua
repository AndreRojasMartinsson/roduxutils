local modules = script:FindFirstAncestor("node_modules")

if modules:FindFirstChild("@rbxts") then
	return require(modules["@rbxts"].immut.src)
elseif modules:FindFirstChild("immut") then
	return require(modules.immut.src)
else
	error("Could not find Immut or @rbxts/immut in the parent hierarchy.")
end
