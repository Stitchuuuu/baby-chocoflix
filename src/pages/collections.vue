<template>
	<div class="page-collections">
		<div class="search-bar">
			<input type="text" placeholder="Rechercher une série, un film...">
		</div>

		<div class="section-title">Tendances</div>
		<div class="row">
			<div class="card"></div><div class="card"></div><div class="card"></div>
			<div class="card"></div><div class="card"></div>
		</div>

		<div class="section-title">Nouveautés</div>
		<div class="row">
			<div class="card"></div><div class="card"></div><div class="card"></div>
			<div class="card"></div><div class="card"></div>
		</div>

		<div class="section-title">Action</div>
		<div class="row">
			<div class="card"></div><div class="card"></div><div class="card"></div>
			<div class="card"></div><div class="card"></div>
		</div>

		<div class="section-title">Science-fiction</div>
		<div class="row">
			<div class="card"></div><div class="card"></div><div class="card"></div>
			<div class="card"></div><div class="card"></div>
		</div>
	</div>
</template>

<style>
.search-bar {
  padding:10px 14px;
  background:#000;
}
.search-bar input{
  width:100%;
  padding:10px;
  border-radius:6px;
  border:none;
  background:#222;
  color:#fff;
}

/* CATEGORIES */
.section-title{
  padding:12px 14px;
  font-weight:700;
}
.row {
  display:flex;
  overflow-x:auto;
  gap:10px;
  padding:0 14px 14px;
}
.card {
  min-width:120px;
  height:170px;
  border-radius:6px;
  background:url('https://picsum.photos/200/300') center/cover;
  flex-shrink:0;
  transition:.3s;
}
.card:hover{transform:scale(1.05)}
</style>