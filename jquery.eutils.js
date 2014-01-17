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
 		search: function(term, params) {
 			var data = $.extend({
				db: 'pubmed',
				retmode: 'xml',
				usehistory: 'y',
				retmax: 0,
				term: term
			}, params);

			var template = {
				count: 'eSearchResult/Count',
				webenv: 'eSearchResult/WebEnv',
				querykey: 'eSearchResult/QueryKey'
			};

 			return $.eutils.get('esearch.fcgi', data, template);
 		},

 		summary: function(result, params) {
 			var data = $.extend({
				db: 'pubmed',
				retmode: 'xml',
				WebEnv: result.webenv,
				query_key: result.querykey,
				retmax: 10,
				retstart: 0,
			}, params);

			var template = [
				'/eSummaryResult/DocSum',
				{
					id: 'Id',
					doi: 'Item[@Name="ArticleIds"]/Item[@Name="doi"]',
					pmc: 'Item[@Name="ArticleIds"]/Item[@Name="pmc"]',
					title: 'Item[@Name="Title"]',
				}
			];

			return $.eutils.get('esummary.fcgi', data, template);
 		},

 		get: function(service, data, template) {
			var deferred = $.Deferred();

			var request = $.ajax({
				url: 'http://eutils.ncbi.nlm.nih.gov/entrez/eutils/' + service,
				data: data,
				dataType: 'xml',
			});

			request.done(function(doc, status, xhr) {
				if (doc) {
					deferred.resolve(Jath.parse(template, doc), status, xhr);
				} else {
					deferred.reject(request, 'error');
				}
			});

			request.fail(deferred.reject);

			return deferred.promise();
		}
 	};
 })(jQuery);
