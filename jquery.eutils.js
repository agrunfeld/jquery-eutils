/*
 * jQuery EUtils v0.1
 * https://github.com/hubgit/jquery-eutils
 *
 * Copyright 2014 Alf Eaton
 * Released under the MIT license
 * http://git.macropus.org/mit-license/
 *
 * Date: 2014-01-16
 */
 (function($) {
 	$.eutils = {
 		search: function(db, term) {
 			var data = {
				db: db,
				retmode: 'xml',
				usehistory: 'y',
				retmax: 0,
				term: term
			};

			var template = {
				count: 'eSearchResult/Count',
				webenv: 'eSearchResult/WebEnv',
				querykey: 'eSearchResult/QueryKey'
			};

 			return get('esearch.fcgi', data, template);
 		},

 		summary: function(db, result, retmax, retstart) {
 			var data = {
				db: db,
				retmode: 'xml',
				WebEnv: result.webenv,
				query_key: result.querykey,
				retmax: retmax || 10,
				retstart: retstart || 0,
			};

			var template = [
				'/eSummaryResult/DocSum',
				{
					id: 'Id',
					doi: 'Item[@Name="ArticleIds"]/Item[@Name="doi"]',
					pmc: 'Item[@Name="ArticleIds"]/Item[@Name="pmc"]',
					title: 'Item[@Name="Title"]',
				}
			];

			return get('esummary.fcgi', data, template);
 		}
 	};

 	var get = function(service, data, template) {
		var deferred = $.Deferred();
		var promise = deferred.promise();

		var request = $.ajax({
			url: 'http://eutils.ncbi.nlm.nih.gov/entrez/eutils/' + service,
			data: data,
			dataType: 'xml',
		});

		request.done(function(doc, status, xhr) {
			if (doc) {
				var result = Jath.parse(template, doc);
				deferred.resolve(result, status, xhr);
			} else {
				deferred.reject(request, 'error');
			}
		});

		request.fail(function(jqXHR, status, error) {
			deferred.reject(jqXHR, status, error);
		});

		return promise;
 	};
 })(jQuery);
