$(function() {
	var status = $('#status');
	var results = $('#results');

	$(document.forms[0]).on('submit', function(event) {
		event.preventDefault();

		status.text('Searching PubMed Central…');

		results.empty();

		var term = this.term.value + " AND pubmed pmc open access[filter] AND free full text[filter]";

		$.eutils.search(term).then(function(result) {
			if (!result.count) {
				return status.text('No articles matched the search terms');
			}

			status.text('Found ' + result.count + ' articles. Fetching…');

			$.eutils.summary(result, { retmax: 20 }).then(function(result) {
				$.each(result, function() {
					var item = $('<a/>', {
						href: 'https://www.ncbi.nlm.nih.gov/pmc/articles/' + this.pmc,
						target: '_blank',
						html: this.title,
					});

					var li = $('<li/>').append(item).appendTo(results);
				});

				status.empty();
			});
		});
	});
});